import HomeApiService from "@/services/homeApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const ContactForm = ({ formOpen, setFormOpen, courseData }: any) => {
    //  console.log("dkdk", courseData?.id)
    const [formValue, setFormValue] = useState({
        // courseId: courseData?.id,
        email: courseData?.email,
        phone: courseData?.phone,
        message: courseData?.message,
        courseName: courseData?.title || "Course",
        country: "India",
        type: "Individuals",
    });

    const onchangeHandle = (e: any) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("course", courseData?.id);
        formData.append("email", formValue.email);
        formData.append("phone_number", formValue.phone);
        formData.append("message", formValue.message);
        formData.append("country", formValue.country);
        formData.append("type", formValue.type);
        formData.append("subject", formValue.courseName);

        HomeApiService.createUserRequest(formData)
            .then((res) => {
                if (res) {
                    setFormOpen(false);
                    setFormValue(
                        {
                            email: "",
                            phone: "",
                            message: "",
                            courseName: "",
                            country: "India",
                            type: "Individuals",
                        }
                    );
                    toast.success("Form submitted successfully");
                }
            })
            .catch((err) => {
                console.error("Error submitting form:", err);
            });
    };

    return (
        <>
            {formOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setFormOpen(!formOpen)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
                            aria-label="Close form"
                        >
                            <RxCross2 className="w-5 h-5" />
                        </button>

                        {/* Content Container */}
                        <div className="p-8">
                            {/* Form Heading */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Get in Touch
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Fill in your details and we'll get back to you soon
                            </p>

                            {/* Form */}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        value={formValue.email}
                                        onChange={onchangeHandle}
                                        required
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="+91 98765 43210"
                                        value={formValue.phone}
                                        onChange={onchangeHandle}
                                        required
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                        value={formValue.message}
                                        onChange={onchangeHandle}
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default ContactForm;