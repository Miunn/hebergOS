import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  /*eslint: {
    ignoreDuringBuilds: true
  }*/
};

export default withNextIntl(nextConfig);
