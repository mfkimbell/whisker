"use client";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AccountPage() {
  // Demo data
  const spendingData = useMemo(
    () => [
      { month: "Jan", amount: 120 },
      { month: "Feb", amount: 300 },
      { month: "Mar", amount: 450 },
      { month: "Apr", amount: 600 },
      { month: "May", amount: 900 },
      { month: "Jun", amount: 1200 },
    ],
    []
  );

  const totalSpent = useMemo(
    () => spendingData.reduce((sum, entry) => sum + entry.amount, 0),
    [spendingData]
  );

  // Additional fake info
  const purchasesCompleted = 24;
  const averageOrderValue = 87.45;
  const lastPurchaseDate = "Jun 10, 2025";
  const paymentMethod = "Visa **** 4242";
  const loyaltyPoints = 1500;
  const memberSince = "Jan 05, 2023";

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar: Profile + Stats */}
          <aside className="md:col-span-4 flex flex-col items-center space-y-6">
            <Card className="p-6 flex flex-col items-center text-center rounded-lg border shadow bg-white">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/jane.png" alt="Jane Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Crown className="absolute -bottom-1 -right-1 h-8 w-8 text-yellow-500 bg-white rounded-full p-1" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Jane Doe</h2>
              <span className="mt-1 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                VIP Member
              </span>
            </Card>

            <Card className="w-full rounded-lg border shadow bg-white">
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
                <div className="mt-1 h-[2px] w-12 bg-orange-500" />
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Purchases Completed</span>
                  <span className="font-mono">{purchasesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Order Value</span>
                  <span className="font-mono">${averageOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Purchase</span>
                  <span className="font-mono">{lastPurchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loyalty Points</span>
                  <span className="font-mono">{loyaltyPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span className="font-mono">{memberSince}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full rounded-lg border shadow bg-white">
              <CardHeader>
                <CardTitle>Payment Info</CardTitle>
                <div className="mt-1 h-[2px] w-12 bg-orange-500" />
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Default Method</span>
                  <span className="font-mono">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Address</span>
                  <span className="font-mono">123 Cat Lane, Birmingham, AL 35203</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-8 flex flex-col space-y-6">
            {/* Spending Summary + Chart */}
            <Card className="rounded-lg border shadow bg-white">
              <CardHeader>
                <CardTitle>Total Spend</CardTitle>
                <div className="mt-1 h-[2px] w-12 bg-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-green-700">
                  ${totalSpent.toLocaleString()}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={spendingData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                    <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profile & Contact Info */}
            <Card className="rounded-lg border shadow bg-white">
              <CardHeader className="pb-2">
                <CardTitle>Profile Info</CardTitle>
                <div className="mt-1 h-[2px] w-12 bg-orange-500" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" defaultValue="Jane Doe" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" defaultValue="jane@example.com" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input type="tel" id="phone" defaultValue="(555) 123-4567" />
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <Button className="bg-orange-600 hover:bg-orange-700 text-white self-start">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
