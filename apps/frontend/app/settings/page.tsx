"use client";

import { Container, Section, NotificationSettings } from "@/components";
import { useI18n } from "@/lib/hooks";
import { User, Globe, Bell, Shield, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const { t, changeLanguage, currentLanguage } = useI18n("common");

  type SettingItem = {
    label: string;
    action: () => void;
    value?: string;
  };

  type SettingSection = {
    id: string;
    title: string;
    icon: React.ReactNode;
    items: SettingItem[];
  };

  const settingSections: SettingSection[] = [
    {
      id: "profile",
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      items: [
        { label: "Edit Profile", action: () => console.log("Edit profile") },
        { label: "Preferences", action: () => console.log("Preferences") },
        { label: "Food Allergies", action: () => console.log("Allergies") },
      ],
    },
    {
      id: "language",
      title: "Language",
      icon: <Globe className="h-5 w-5" />,
      items: [
        {
          label: "App Language",
          value: currentLanguage.toUpperCase(),
          action: () => {
            const newLang = currentLanguage === "en" ? "vi" : "en";
            changeLanguage(newLang);
          },
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          label: "Privacy Policy",
          action: () => console.log("Privacy policy"),
        },
        { label: "Data Usage", action: () => console.log("Data usage") },
        {
          label: "Location Permissions",
          action: () => console.log("Location"),
        },
      ],
    },
    {
      id: "help",
      title: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      items: [
        { label: "FAQ", action: () => console.log("FAQ") },
        { label: "Contact Support", action: () => console.log("Support") },
        { label: "Report a Problem", action: () => console.log("Report") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white">
        <Container>
          <div className="py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                ⚙️ Settings
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Manage your account and app preferences
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Notifications Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                </div>
                <NotificationSettings />
              </div>

              {/* Other Settings Sections */}
              {settingSections.map((section) => (
                <div key={section.id}>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-blue-600">{section.icon}</span>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border divide-y divide-gray-200">
                    {section.items.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-gray-900">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          {item.value && (
                            <span className="text-sm text-gray-500">
                              {item.value}
                            </span>
                          )}
                          <span className="text-gray-400">›</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* App Info */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  App Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Version</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build</span>
                    <span>2025.08.06</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Environment</span>
                    <span>{process.env.NODE_ENV}</span>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-4">
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
