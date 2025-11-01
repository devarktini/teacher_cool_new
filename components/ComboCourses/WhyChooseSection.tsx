// WhyChooseSection.jsx
import React from "react";

const WhyChooseSection = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Why Choose TeacherCool */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose Teachercool?
          </h2>
          <p className="text-gray-600 max-w-3xl mb-8">
            Affordable, structured learning that actually gets you job-ready.
            Learn with real datasets, case studies, quizzes, and portfolio-worthy projects.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Certificate of Completion</h3>
              <p className="text-gray-600 text-sm">
                Earn a shareable certificate for each bundle. Showcase on LinkedIn and your resume.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Industry Projects</h3>
              <p className="text-gray-600 text-sm">
                Solve real-world problems: EDA, ML pipelines, CV models, dashboards in Power BI.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Lifetime Access</h3>
              <p className="text-gray-600 text-sm">
                No subscription pressure. Learn at your pace with future updates included.
              </p>
            </div>
          </div>
        </div>

        {/* Build Portfolio */}
        <div className="bg-gray-50 py-12 px-6 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Build a Job-Ready Portfolio
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold mb-2">ML: Customer Churn Prediction</h3>
              <p className="text-gray-600 text-sm">
                Feature engineering, model selection, evaluation metrics, deployment notes.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold mb-2">CV: Defect Detection</h3>
              <p className="text-gray-600 text-sm">
                Transfer learning, augmentation, performance tuning with confusion matrix.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="font-semibold mb-2">BI: Sales Insights Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Data modeling, DAX measures, storytelling visuals, KPI tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseSection;
