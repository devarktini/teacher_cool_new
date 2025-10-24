import React, { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import ProgressBar from "../ui/ProgressBar";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import { Button, Modal, Rate, message } from "antd";

type CourseProgressProps = {
  progress: number;
  item: any;
  percentage?: number;
  index:any
};

function CourseProgress({ progress, item,index }: CourseProgressProps) {
  const [courseLink, setCourseLink] = useState<string>("Hello I am the Link");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [reviewValue, setReviewValue] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [courseOutcomes, setCourseOutcomes] = useState<{ module: string; lecture: string[] }>({
    module: "",
    lecture: [],
  });

  // derive outcomes safely when item updates
  useEffect(() => {
    const raw = item?.modules ?? [];
    if (Array.isArray(raw) && raw.length) {
      const firstModule = raw[0];
      setCourseOutcomes({
        module: firstModule?.title ?? "Module 1",
        lecture: firstModule?.lectures?.map((l: any) => l.title) ?? [],
      });
    } else {
      setCourseOutcomes({ module: item?.title ?? "—", lecture: [] });
    }
  }, [item]);

  // responsive boolean without using window.* in render
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 786px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    // initial
    update(mql);
    // listen
    if ("addEventListener" in mql) {
      mql.addEventListener("change", update);
    } else {
      // older browsers
      // @ts-ignore
      mql.addListener(update);
    }
    return () => {
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", update);
      } else {
        // @ts-ignore
        mql.removeListener(update);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(courseLink);
      message.success("Course URL copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy the URL.");
      console.error(err);
    }
  };

  const handleRateSubmit = () => {
    // TODO: integrate API call here
    message.success(`Thanks for rating ${rating} ★ — "${reviewValue}"`);
    setRateModal(false);
    setRating(0);
    setReviewValue("");
  };

  // SVG corrected for React attribute names
  const PlaySVG = (
    <svg
      className="cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      aria-hidden
    >
      <g clipPath="url(#clip0_2058_4938)">
        <path
          d="M22.5953 6.42C22.4765 5.94541 22.2345 5.51057 21.8939 5.15941C21.5533 4.80824 21.126 4.55318 20.6553 4.42C18.9353 4 12.0553 4 12.0553 4C12.0553 4 5.17526 4 3.45526 4.46C2.98451 4.59318 2.55724 4.84824 2.21661 5.19941C1.87598 5.55057 1.63405 5.98541 1.51526 6.46C1.20047 8.20556 1.0465 9.97631 1.05526 11.75C1.04404 13.537 1.19803 15.3213 1.51526 17.08C1.64622 17.5398 1.89357 17.9581 2.2334 18.2945C2.57324 18.6308 2.99408 18.8738 3.45526 19C5.17526 19.46 12.0553 19.46 12.0553 19.46C12.0553 19.46 18.9353 19.46 20.6553 19C21.126 18.8668 21.5533 18.6118 21.8939 18.2606C22.2345 17.9094 22.4765 17.4746 22.5953 17C22.9076 15.2676 23.0616 13.5103 23.0553 11.75C23.0665 9.96295 22.9125 8.1787 22.5953 6.42Z"
          stroke="#1E1E1E"
          strokeOpacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.80469 15.0205L15.5547 11.7505L9.80469 8.48047V15.0205Z"
          stroke="#1E1E1E"
          strokeOpacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2058_4938">
          <rect width="24" height="24" fill="white" transform="translate(0.0546875)" />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <>
      <div className="w-full p-3 rounded-md shadow-sm bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* LEFT: Thumbnail + title + progress */}
          <div className="flex w-full md:w-3/4 gap-3 items-start">
            <div className="w-28 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
              {item?.banner ? (
                <img
                  src={getCompleteUrl(item.banner)}
                  alt={item?.title ?? "course banner"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={process.env.PUBLIC_URL + "/images/student/coursesimage.png"}
                  alt="default course"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-semibold truncate">{item?.title ?? "Untitled Course"}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item?.subtitle ?? item?.description ?? ""}</p>
                </div>

                {/* ellipsis for menu (mobile+desktop handled by isMobile) */}
                <div className="relative">
                  <button
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((s) => !s)}
                    className="p-1 rounded hover:bg-gray-100"
                    title="More"
                  >
                    <FaEllipsisVertical className="text-lg" />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-9 z-20 w-40 bg-white border rounded-md shadow-md overflow-hidden"
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <button
                        role="menuitem"
                        onClick={() => {
                          setRateModal(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      >
                        Rate
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setShareModal(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      >
                        Share
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          setUpgradeModal(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      >
                        Upgrade
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <ProgressBar
                  bgcolor="#0966ED"
                  progress={progress > 100 ? 100 : progress}
                  width={"full"}
                  text={"Learning Progress"}
                  textColor="#1E1E1E"
                  value={progress}
                  height={8}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Next up + actions */}
          <div className="w-full md:w-1/4 flex flex-col items-start md:items-end gap-3">
            <div className="w-full md:w-auto flex items-center gap-3">
              <div className="flex items-center gap-3">
                {PlaySVG}
                <div className="text-xs text-gray-700">
                  <div className="font-medium text-[13px] truncate w-36">{courseOutcomes.module}</div>
                  <div className="text-[12px] text-gray-500 truncate w-36">
                    {courseOutcomes.lecture[0] ?? "No lectures"}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex gap-2">
              <Button size="small" onClick={() => /* navigate or callback */ null}>
                Continue
              </Button>
              <Button size="small" onClick={() => setShareModal(true)}>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        title="Share course"
        open={shareModal}
        onOk={() => {
          handleCopy();
          setShareModal(false);
        }}
        onCancel={() => setShareModal(false)}
        okText="Copy link"
      >
        <p className="text-sm text-gray-700">Share this course link with others:</p>
        <div className="mt-3 flex gap-2">
          <input
            readOnly
            value={courseLink}
            onChange={() => {}}
            className="flex-1 border px-2 py-1 rounded"
            aria-label="course link"
          />
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal title="Upgrade course" open={upgradeModal} onOk={() => setUpgradeModal(false)} onCancel={() => setUpgradeModal(false)}>
        <p className="text-sm text-gray-700">
          Upgrade to the premium version to unlock additional content and certificates. {/* Replace with your real upsell */}
        </p>
        <div className="mt-3">
          <Button type="primary" onClick={() => { message.info("Redirect to upgrade flow"); setUpgradeModal(false); }}>
            Go to Upgrade
          </Button>
        </div>
      </Modal>

      {/* Rate Modal */}
      <Modal
        title="Rate this course"
        open={rateModal}
        onOk={handleRateSubmit}
        onCancel={() => setRateModal(false)}
        okText="Submit"
      >
        <div className="space-y-3">
          <div>
            <Rate onChange={setRating} value={rating} />
          </div>
          <textarea
            value={reviewValue}
            onChange={(e) => setReviewValue(e.target.value)}
            rows={4}
            placeholder="Write a short review (optional)"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </Modal>
    </>
  );
}

export default CourseProgress;
