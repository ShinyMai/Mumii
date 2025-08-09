"use client";

import { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Check,
} from "lucide-react";
import { useI18n } from "@/lib/hooks";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
}

export function SocialShare({
  title,
  description = "",
  url,
  image,
  hashtags = [],
  className = "",
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} ${description ? `- ${description}` : ""}`;
  const hashtagString =
    hashtags.length > 0
      ? hashtags.map((tag) => `#${tag}`).join(" ")
      : "#Mumii #FoodTravel";

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      share: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      share: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(
          hashtags.join(",")
        )}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
      },
    },
    {
      name: "Instagram",
      icon: Instagram,
      color:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      share: () => {
        // Instagram doesn't support direct sharing from web, so we'll copy the text
        copyToClipboard(`${shareText} ${shareUrl} ${hashtagString}`);
        alert(
          t(
            "social.instagramCopied",
            "Content copied! You can paste it in Instagram."
          )
        );
      },
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>{t("social.share", "Share")}</span>
      </button>

      {/* Custom Share Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("social.shareThis", "Share this")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Social Platforms */}
            <div className="space-y-3 mb-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => {
                      platform.share();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white transition-colors ${platform.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>
                      {t(
                        `social.shareOn${platform.name}`,
                        `Share on ${platform.name}`
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t pt-4">
              <button
                onClick={() => {
                  copyToClipboard(shareUrl);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-800">
                  {copied
                    ? t("social.copied", "Copied!")
                    : t("social.copyLink", "Copy Link")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
