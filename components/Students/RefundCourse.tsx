'use client'

import StudentApiService from "@/services/studentApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Refund {
  title: string;
  description: string;
  payment: string;
}

interface RefundProcessProps {
  paymentId: string;
  courseName: string;
}

const RefundProcess = ({ paymentId, courseName }: RefundProcessProps) => {
  const [refundPay, setRefundPay] = useState<Refund>({ title: '', description: '', payment: paymentId });
  const [refundExists, setRefundExists] = useState<Refund | null>(null);
  const [loading, setLoading] = useState(true);

  const refundChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRefundPay(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const checkRefundStatus = async () => {
      setLoading(true);
      try {
        const response = await StudentApiService.getAllRefunds();
        // Ensure we are accessing the data array
        const refunds: Refund[] = response.data || [];
        const existingRefund = refunds.find(item => item.payment === paymentId);
        setRefundExists(existingRefund || null);
      } catch (error) {
        console.error("Error fetching refund data:", error);
        toast.error("Failed to load refund data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkRefundStatus();
  }, [paymentId]);

  const handleRefund = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await StudentApiService.getAllRefunds();
    const refunds: Refund[] = response.data || [];
    const refundIds = refunds.map(item => item.payment);

    if (refundIds.includes(refundPay.payment)) {
      toast.success("Refund Already sent");
      return;
    }

    await StudentApiService.refundRequest(refundPay);
    setRefundPay({ title: '', description: '', payment: paymentId });
    toast.success("Refund Request Sent");
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (refundExists) {
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg border border-gray-300 overflow-x-auto">
        <h4 className="text-black text-lg font-semibold mb-4">Refund Already Applied</h4>
        <table className="w-full border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">PaymentId</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">{refundExists.title}</td>
              <td className="border px-4 py-2">{refundExists.description}</td>
              <td className="border px-4 py-2">{refundExists.payment}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg border border-gray-300 flex flex-col gap-4">
      <h3 className="text-black text-lg font-semibold">Apply For Refund</h3>
      <input
        className="p-2 border border-gray-300 rounded text-black"
        type="text"
        placeholder="Title"
        name="title"
        value={refundPay.title}
        onChange={refundChange}
      />
      <textarea
        className="p-2 border border-gray-300 rounded text-black h-24"
        placeholder="Description"
        name="description"
        value={refundPay.description}
        onChange={refundChange}
      />
      <input
        className="p-2 border border-gray-300 rounded text-black"
        type="text"
        placeholder="Payment ID"
        name="payment"
        value={courseName}
        readOnly
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        onClick={handleRefund}
      >
        Proceed
      </button>
    </div>
  );
};

export default RefundProcess;
