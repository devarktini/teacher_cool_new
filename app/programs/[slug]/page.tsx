import React from 'react'
import HomeApiService from '@/services/homeApi'
import CampaignDetails from '../page';
import { notFound } from 'next/navigation';

interface Campaign {
  params: {
    slug: string;
  };
}

async function page({params}: Campaign) {
  const {slug} = params;
  
  try {
    const data = await HomeApiService.getCampaignByRoute(slug);

    // Check if data exists and has the expected structure
    if (!data || !data.data) {
      notFound();
    }

    return (
      <>
        <CampaignDetails data={data}/>
      </>
    )
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    notFound();
  }
}

export default page;