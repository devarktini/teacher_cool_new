import React from 'react'
import HomeApiService from '@/services/homeApi'
import CampaignDetails from '../page';
interface Campaign {
  params: {
    slug: string;
    
  };
}

async function page({params}:Campaign) {

const {slug} = params;
 const data =await HomeApiService.getCampaignByRoute(slug);
//  console.log(data)
  return (
    <>
      <CampaignDetails data = {data}/>
    </>
  )
}

export default page
