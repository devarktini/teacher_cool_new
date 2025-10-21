import CareerDiscovery from '@/components/WorldClass/CareerDiscovery'
import Demand from '@/components/WorldClass/Demand'
import GuidedProjects from '@/components/WorldClass/GuidedProjects'
import ProfessionalCertificates from '@/components/WorldClass/ProfessionalCertificates'
import React from 'react'

function page() {
    return (
        <>
            <Demand />
            <ProfessionalCertificates />
            <GuidedProjects />
            <CareerDiscovery />
        </>
    )
}

export default page
