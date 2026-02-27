'use client';

import React, { useEffect, useState } from "react";
import { Sparkles, Briefcase, Users } from "lucide-react";
import certificate from '@/public/images/teachercool.png';
import signature from '@/public/images/deepikasign.png';
import WorkshopThanks from "./WorkshopThanks";
import HomeApiService from "@/services/homeApi";
import { useRouter } from "next/navigation";

interface Workshop {
  id: string;
  name: string;
  description: string;
  date: string;
  institute_name?: string;
  to_date?: string;
  others?: Record<string, any>;

}

interface WorkshopDetailProps {
  workshopId: string;
}

interface FormData {
  fullname: string;
  mobile: string;
  email: string;
  collegeName: string;
  collegeLocation: string;
  course: string;
}

interface Toast {
  message: string;
  type: "error" | "success";
}

interface ProgramCard {
  title: string;
  description: string;
  button: {
    label: string;
    link: string;
  };
  image: string;
}

export default function WorkshopDetail({ workshopId }: WorkshopDetailProps) {
  const [workshops, setWorkshops] = useState<Workshop | null>(null);
  const [attendee, setAttendee] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    fullname: "",
    mobile: "",
    email: "",
    collegeName: "",
    collegeLocation: "",
    course: "",
  });

  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchWorkshops();
    fetchAttendee();
  }, [workshopId]);

  const fetchWorkshops = async (): Promise<void> => {
    setLoading(true);
    try {
      const res: any = await HomeApiService.getWorkshopById(workshopId);
      setWorkshops(res);
    } catch (err) {
      console.error("Failed to fetch workshops:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendee = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await HomeApiService.getAttendeeTWo();
      const list = res?.results ?? res?.data ?? (Array.isArray(res) ? res : []);
      setAttendee(list);
    } catch (err) {
      console.error("Failed to fetch attendees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const isValidUser = (): boolean => {
    if (!form.email || !workshops?.name) return false;

    const email = form.email.trim().toLowerCase();
    const workshopName = workshops.name.trim().toLowerCase();

    const filtered = attendee.filter(
      (a) => (a.workshop?.name ?? "").toLowerCase() === workshopName
    );

    return filtered.some((a) => (a.email ?? "").toLowerCase() === email);
  };

  const formatDate = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    const d = new Date(raw);
    return !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : String(raw);
  };

  const capitalizeFullName = (name: string): string =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const drawName = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    baseFontSize: number,
    maxWidth: number,
    width: number
  ): { height: number; lines: number } => {
    let fontSize = baseFontSize;
    const minFontSize = Math.max(20, Math.round(width * 0.03));

    const setFont = (sz: number) => {
      ctx.font = `700 italic ${sz}px Georgia, 'Times New Roman', serif`;
    };

    setFont(fontSize);

    while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
      fontSize = Math.max(minFontSize, Math.round(fontSize * 0.95));
      setFont(fontSize);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = Math.max(2, Math.round(width * 0.0025));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (ctx.measureText(text).width <= maxWidth) {
      ctx.strokeText(text, x, y);
      ctx.fillStyle = "#073b6b";
      ctx.fillText(text, x, y);
      return { height: fontSize, lines: 1 };
    }

    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";

    for (let word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);

    const finalFontSize = Math.max(minFontSize, Math.round(baseFontSize * 0.8));
    setFont(finalFontSize);
    const lineGap = finalFontSize * 1.1;
    const totalHeight = (lines.length - 1) * lineGap;

    lines.forEach((line, i) => {
      const lineY = y - totalHeight / 2 + i * lineGap;
      ctx.strokeText(line, x, lineY);
      ctx.fillStyle = "#073b6b";
      ctx.fillText(line, x, lineY);
    });

    return { height: totalHeight + finalFontSize, lines: lines.length };
  };

  const downloadCertificate = async (): Promise<void> => {
    if (!form.fullname.trim() || !form.email.trim()) {
      showToast("Please enter name and email", "error");
      return;
    }

    if (!isValidUser()) {
      showToast("Not a registered email or workshop", "error");
      return;
    }

    const selectedWorkshopName = workshops?.name ?? "";
    const selectedWorkshopDateRaw = workshops?.date ?? "";
    const selectedWorkshopDateRawTo = workshops?.to_date ?? "";

    const fromDate = formatDate(selectedWorkshopDateRaw);
    const toDate = formatDate(selectedWorkshopDateRawTo);
    const dateText = fromDate
      ? toDate
        ? `${fromDate} - ${toDate}`
        : fromDate
      : new Date().toLocaleDateString();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = certificate.src;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert("Failed to get canvas context.");
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const centerX = width / 2;
      const yOffset = 250;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Title
      const titleFontSize = Math.round(width * 0.045);
      ctx.fillStyle = "#073b6b";
      ctx.font = `700 ${titleFontSize}px Georgia, 'Times New Roman', serif`;
      ctx.fillText("E-Certificate of Participation", centerX, height * 0.16 + yOffset);

      // Subtitle
      const subtitleFontSize = Math.round(width * 0.028);
      ctx.font = `700 ${subtitleFontSize}px Arial, sans-serif`;
      ctx.fillStyle = "#2f3e4f";
      ctx.fillText("This is to certify that", centerX, height * 0.22 + yOffset);

      const nameText = capitalizeFullName(form.fullname);
      const nameBaseFontSize = Math.round(width * 0.07);
      const nameMaxWidth = Math.round(width * 0.82);
      const nameY = height * 0.3 + yOffset;

      const nameResult = drawName(
        ctx,
        nameText,
        centerX,
        nameY,
        nameBaseFontSize,
        nameMaxWidth,
        width
      );
      let nextY = nameY + nameResult.height * 0.8;

      // Institute Name
      const instituteName = workshops?.institute_name?.trim();
      if (instituteName) {
        const instFontSize = Math.round(width * 0.027);
        ctx.font = `600 ${instFontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#073b6b";
        ctx.fillText(
          capitalizeFullName(instituteName),
          centerX,
          nextY + instFontSize * 0.8
        );
        nextY += instFontSize * 1.2;
      }

      // Institute Year
      const instituteYear = workshops?.others?.institute_year;
      if (instituteYear) {
        const yearFontSize = Math.round(width * 0.024);
        ctx.font = `600 ${yearFontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#225292";
        ctx.fillText(instituteYear, centerX, nextY + yearFontSize * 0.8);
        nextY += yearFontSize * 1.0;
      }

      // // Info line
      // const infoFontSize = Math.round(width * 0.027);
      // ctx.font = `700 ${infoFontSize}px Arial, sans-serif`;
      // ctx.fillStyle = "#2f3e4f";
      // const infoText = selectedWorkshopName
      //   ? `has successfully completed the workshop in ${capitalizeFullName(selectedWorkshopName)}`
      //   : `has successfully completed the workshop`;
      // ctx.fillText(infoText, centerX, nextY + infoFontSize * 1.2);
      // nextY += infoFontSize * 1.5;
      // Info lines
      // Info lines
      const infoFontSize = Math.round(width * 0.027);

      // 🔥 Add proper spacing before starting this block
      nextY += infoFontSize * 1.2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#2f3e4f";

      // Line 1
      ctx.font = `700 ${infoFontSize}px Arial, sans-serif`;
      ctx.fillText("has successfully completed", centerX, nextY);

      // Line 2
      nextY += infoFontSize * 1.4;
      ctx.fillText("in", centerX, nextY);

      // Line 3 (Workshop Name)
      if (selectedWorkshopName) {
        nextY += infoFontSize * 1.6;

        const workshopName = capitalizeFullName(selectedWorkshopName);

        ctx.font = `700 ${infoFontSize * 1.25}px Arial, sans-serif`;
        ctx.fillStyle = "#073b6b"; // slightly highlighted
        ctx.fillText(workshopName, centerX, nextY);

        nextY += infoFontSize * 0.8;
      }
      // Certificate Description
      const certDesc = workshops?.others?.certificate_description;
      if (certDesc) {
        const descFontSize = Math.round(width * 0.023);
        ctx.font = `400 italic ${descFontSize}px Georgia, 'Times New Roman', serif`;
        ctx.fillStyle = "#2a2a2a";
        const maxWidth = width * 0.82;
        const words = certDesc.split(" ");
        const lines: string[] = [];
        let line = "";

        for (let word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxWidth) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);

        nextY += descFontSize * 0.8;

        const lineGap = descFontSize * 1.2;
        lines.forEach((l, i) => ctx.fillText(l, centerX, nextY + i * lineGap));
        nextY += lines.length * lineGap + descFontSize * 0.5;
      }

      // Date line
      const dateFontSize = Math.round(width * 0.028);
      ctx.font = `700 ${dateFontSize}px Arial, sans-serif`;
      ctx.fillStyle = "#1f2d3a";

      nextY += dateFontSize * 1.2;
      ctx.fillText(`Date: ${dateText}`, centerX, nextY);
      nextY += dateFontSize * 1.5;

      // Signature section
      const sigFontSize = Math.round(width * 0.022);
      const sigNameText = "Dr. Deepika Sharma";
      const sigTitleText = "Director Training";
      const sigX = width * 0.78;
      const sigY = Math.max(nextY + height * 0.08, height * 0.75);
      const sigLineW = width * 0.18;

      const finalizeAndDownload = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            alert("Failed to generate certificate.");
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const safeName = form.fullname
            .trim()
            .replace(/[^a-z0-9_\-\.]/gi, "_");
          a.href = url;
          a.download = `${safeName}_certificate.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png", 1.0);
        setThankYou(true);
      };

      const sigImg = new Image();
      sigImg.crossOrigin = "anonymous";
      sigImg.src = signature.src;

      sigImg.onload = () => {
        const sigW = sigLineW * 0.9;
        const aspect =
          sigImg.naturalWidth && sigImg.naturalHeight
            ? sigImg.naturalHeight / sigImg.naturalWidth
            : 0.35;
        const sigH = sigW * aspect;
        ctx.drawImage(sigImg, sigX - sigW / 2, sigY - sigH, sigW, sigH);

        ctx.strokeStyle = "#111827";
        ctx.lineWidth = Math.max(1, Math.round(width * 0.001));
        ctx.beginPath();
        ctx.moveTo(sigX - sigLineW / 2, sigY);
        ctx.lineTo(sigX + sigLineW / 2, sigY);
        ctx.stroke();

        ctx.font = `600 ${sigFontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#0b2b4a";
        ctx.fillText(sigNameText, sigX, sigY + sigFontSize + 6);
        ctx.fillText(sigTitleText, sigX, sigY + sigFontSize * 2 + 10);
        finalizeAndDownload();
      };

      sigImg.onerror = () => {
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = Math.max(1, Math.round(width * 0.001));
        ctx.beginPath();
        ctx.moveTo(sigX - sigLineW / 2, sigY);
        ctx.lineTo(sigX + sigLineW / 2, sigY);
        ctx.stroke();

        ctx.font = `600 ${sigFontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#0b2b4a";
        ctx.fillText(sigNameText, sigX, sigY + sigFontSize + 6);
        ctx.fillText(sigTitleText, sigX, sigY + sigFontSize * 2 + 10);
        finalizeAndDownload();
      };
    };

    img.onerror = () => alert("Failed to load certificate template image.");
  };

  const headerWorkshop = workshops;
  const workshopTitle = headerWorkshop?.name ?? "Campus Bonanza – Skill Bundle Pack";
  const workshopDate = headerWorkshop?.date
    ? new Date(headerWorkshop.date).toLocaleDateString("en-GB")
    : "TBA";
  const workshopDateTo = headerWorkshop?.to_date
    ? new Date(headerWorkshop.to_date).toLocaleDateString("en-GB")
    : null;
  const workshopDescription =
    headerWorkshop?.description ??
    "Practical, project-driven workshop with hands-on sessions and certificate.";

  const programCards: ProgramCard[] = [
    {
      title: "Online Courses Combo",
      description:
        "Access our complete set of affordable online courses to upskill & reskill yourself. Self-paced lessons, quizzes, and community support.",
      button: { label: "View Courses", link: "/online-courses-combo" },
      image: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">
        <rect rx="12" width="360" height="200" fill="#241433"/>
        <g transform="translate(26,28)">
          <rect x="0" y="0" width="200" height="120" rx="10" fill="#fff" opacity="0.06"/>
          <rect x="20" y="20" width="160" height="20" rx="5" fill="#06b6d4"/>
          <rect x="20" y="50" width="120" height="18" rx="5" fill="#7c3aed"/>
          <rect x="20" y="80" width="140" height="18" rx="5" fill="#f59e0b"/>
          <circle cx="260" cy="60" r="40" fill="#0ea5e9" opacity="0.25"/>
          <text x="230" y="66" font-family="sans-serif" font-size="18" fill="#fff">🎓</text>
        </g>
      </svg>
    `)}`
    },
    {
      title: "Professional Certificate Program",
      description:
        "Join our flagship program in Data Science, Machine Learning & AI with hands-on projects, mentorship, and career support.",
      button: {
        label: "Learn More",
        link: "/programs/professional-certificate-in-data-science-machine-learning-and-artificial-intelligence-program"
      },
      image: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">
        <rect rx="12" width="360" height="200" fill="#241433"/>
        <g transform="translate(30,30)">
          <rect x="0" y="0" width="220" height="120" rx="8" fill="#fff" opacity="0.04"/>
          <path d="M20 100 L60 60 L100 80 L140 40 L180 70 L220 30" stroke="#f97316" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="60" cy="60" r="8" fill="#06b6d4"/>
          <circle cx="140" cy="40" r="8" fill="#7c3aed"/>
          <circle cx="220" cy="30" r="8" fill="#f59e0b"/>
          <text x="240" y="90" font-family="sans-serif" font-size="18" fill="#fff">📊</text>
        </g>
      </svg>
    `)}`
    },
    {
      title: "Teacher Cool",
      description:
        "Learn with Teacher Cool — engaging workshops, expert instructors, and an amazing learning community for students and professionals.",
      button: { label: "Visit Teacher Cool", link: "/" },
      image: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">
        <rect rx="12" width="360" height="200" fill="#241433"/>
        <g transform="translate(30,30)">
          <circle cx="80" cy="70" r="40" fill="#4f46e5" opacity="0.8"/>
          <circle cx="180" cy="90" r="30" fill="#06b6d4" opacity="0.8"/>
          <circle cx="260" cy="60" r="35" fill="#f97316" opacity="0.8"/>
          <text x="75" y="75" font-family="sans-serif" font-size="22" fill="#fff">👩‍🏫</text>
          <text x="170" y="95" font-family="sans-serif" font-size="22" fill="#fff">📚</text>
          <text x="250" y="65" font-family="sans-serif" font-size="22" fill="#fff">✨</text>
        </g>
      </svg>
    `)}`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Promo banner */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="rounded-lg overflow-hidden bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg">
          <div className="py-6 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="uppercase tracking-wide font-semibold text-sm opacity-90">
                Campus Bonanza - Skill Bundle Pack
              </div>
              <div className="mt-4 text-center">
                <div className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2 shadow-md">
                  Limited Time Offer
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Price Starts From{" "}
                  <span className="text-cyan-400">₹1,999</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/online-courses-combo")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-semibold shadow"
              >
                GET BUNDLE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header: title, date, description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase">
            {workshopTitle}
          </h2>
          {workshopDateTo === null ? (
            <p className="mt-2 text-indigo-600 font-semibold">
              📅 {workshopDate}
            </p>
          ) : (
            <>
              <p className="mt-2 text-indigo-600 font-semibold">
                From: {workshopDate}
              </p>
              <p className="mt-2 text-indigo-600 font-semibold">
                To: {workshopDateTo}
              </p>
            </>
          )}
          <p className="mt-4 max-w-3xl mx-auto text-gray-600">
            {workshopDescription}
          </p>
        </div>

        {/* Why choose */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-bold mb-6">Why Choose Our Courses?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-full">
                <Sparkles className="text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Expert Instructors</div>
                <div className="text-sm text-gray-500">
                  Learn from professionals with industry experience
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-full">
                <Users className="text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Flexible Learning</div>
                <div className="text-sm text-gray-500">
                  Study on your schedule, anytime, anywhere
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-full">
                <Briefcase className="text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Career Growth</div>
                <div className="text-sm text-gray-500">
                  Acquire skills that boost your career prospects
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* programs card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {programCards.map((card, i) => (
            <div
              key={i}
              className="relative bg-[#1b0f2a] text-white rounded-2xl p-6 shadow-2xl overflow-hidden transform transition hover:-translate-y-1"
              style={{ minHeight: 380 }}
            >
              <div className="flex items-center justify-between mb-3">
                {i === 0 && (
                  <div className="inline-flex items-center gap-2 bg-[#ff6b3d] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    <span className="uppercase">Bundle Pack</span>
                  </div>
                )}
                <div className="w-11 h-11 rounded-lg bg-white/8 flex items-center justify-center" />
              </div>

              {/* Illustration */}
              <div className="rounded-xl bg-gradient-to-tr from-[#2a1635] to-[#311a44] p-3 mb-4 flex items-center justify-center">
                <img
                  src={card.image}
                  alt={`${card.title} illustration`}
                  className="w-full h-36 object-contain rounded-md"
                  style={{ background: "transparent" }}
                />
              </div>

              {/* Title */}
              <h4 className="text-xl font-semibold mb-2 leading-tight">
                {card.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4">
                {card.description}
              </p>

              {/* Button */}
              <a
                href={card.button.link}
                className="inline-block mt-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium shadow hover:shadow-lg transition"
              >
                {card.button.label}
              </a>

              <div className="absolute left-4 bottom-4 w-20 h-10 rounded-full bg-white/3 blur-[8px] opacity-10 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Download certificate form */}
        <div className="bg-white border rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-center mb-6">
            Download Your Certificate
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              downloadCertificate();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
          >
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">
                College Name
              </label>
              <input
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">
                College Location
              </label>
              <input
                name="collegeLocation"
                value={form.collegeLocation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                GET CERTIFICATE
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-emerald-500 text-white"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Thank you modal */}
      {thankYou && <WorkshopThanks onclose={() => setThankYou(false)} />}
    </div>
  );
}