import { ProtectedAppLayout } from "@/components/ProtectedAppLayout";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAppLayout>{children}</ProtectedAppLayout>;
}
