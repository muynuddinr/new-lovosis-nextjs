import Sol from "../Components/Certificates";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Certificates - Lovosis | Quality Certifications & Standards",
  description: "Explore Lovosis quality certifications, standards, and achievements that validate our commitment to excellence in trainer kits and test instruments.",
  keywords: ["certificates", "quality certifications", "standards", "achievements", "ISO certifications"],
  openGraph: {
    title: "Certificates - Lovosis | Quality Certifications & Standards",
    description: "Lovosis quality certifications and industry standards",
    url: "https://lovosis.in/Gallery",
    type: "website",
  },
};

export default function Home() {
  return (
    <div>
      <Sol />
    </div>
  );
}
