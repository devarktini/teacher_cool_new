
import GenerateNewPassword from '@/components/Authentication/GenerateNewPassward';
import React from 'react';

interface PageProps {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params }: PageProps) {
  const { uid, token } = params;

  return <GenerateNewPassword uid={uid} token={token} />;
}
