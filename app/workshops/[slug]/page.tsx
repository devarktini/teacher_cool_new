import WorkshopDetail from "@/components/workshops/WorkshopDetail";

interface PageProps {
  params: { slug: string };
  searchParams: { id: string };
}

export default function Page({ params, searchParams }: PageProps) {

  const { id } = searchParams;

  return (
    <>
   

      <WorkshopDetail  workshopId={id} />
    </>
  );
}
