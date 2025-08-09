"use client";

import { Container, Section } from "@/components";
import { useI18n } from "@/lib/hooks";
import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  restaurant?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 185000,
    description: "Dinner at Bún Chả Hương Liên",
    category: "Food",
    date: "2025-01-06",
    restaurant: "Bún Chả Hương Liên",
  },
  {
    id: "2",
    type: "expense",
    amount: 450000,
    description: "Lunch at Madame Hiên",
    category: "Food",
    date: "2025-01-05",
    restaurant: "Madame Hiên",
  },
  {
    id: "3",
    type: "income",
    amount: 2000000,
    description: "Monthly budget top-up",
    category: "Budget",
    date: "2025-01-01",
  },
];

export default function WalletPage() {
  const { t } = useI18n("common");
  const [balance] = useState(1365000);
  const [showTopUp, setShowTopUp] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white">
        <Container>
          <div className="py-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                💳 Ví của tôi
              </h1>
              <p className="text-gray-600">Quản lý chi tiêu ẩm thực của bạn</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-6 h-6" />
                  <span className="text-lg font-medium">Số dư hiện tại</span>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold mb-1">
                  {formatVND(balance)}
                </div>
                <div className="text-orange-100 text-sm">
                  Cập nhật lần cuối: Hôm nay, 15:30
                </div>
              </div>
              <button
                onClick={() => setShowTopUp(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nạp tiền</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ArrowDownLeft className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Thu nhập</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatVND(2000000)}
                  </p>
                  <p className="text-xs text-gray-500">Tháng này</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ArrowUpRight className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Chi tiêu</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {formatVND(635000)}
                  </p>
                  <p className="text-xs text-gray-500">Tháng này</p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Giao dịch gần đây
                </h2>
                <button className="text-orange-500 text-sm font-medium">
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft className={`w-5 h-5 text-green-600`} />
                        ) : (
                          <ArrowUpRight className={`w-5 h-5 text-red-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <p className="font-bold">
                        {transaction.type === "income" ? "+" : "-"}
                        {formatVND(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spending Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Phân tích chi tiêu
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Ăn uống</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      65%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Di chuyển</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      25%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Khác</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      10%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Nạp tiền vào ví
              </h3>
              <button
                onClick={() => setShowTopUp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền
                </label>{" "}
                <input
                  type="number"
                  placeholder="100,000"
                  className="search-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  <div className="flex items-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment" className="mr-3" />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Thẻ ngân hàng</span>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="payment" className="mr-3" />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Ví điện tử</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                Xác nhận nạp tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
