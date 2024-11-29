import { type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster"

// Blocks


// FDM
import { fdm } from "../services/fdm.server";
import { getCultivationPlan, getFertilizersFromCatalogue } from "@svenvw/fdm-core";
import { Button } from "@/components/ui/button";
import Cultivation, { SidebarNav } from "@/components/blocks/cultivation-plan";

// Meta
export const meta: MetaFunction = () => {
    return [
        { title: "FDM App" },
        { name: "description", content: "Welcome to FDM!" },
    ];
};

// Loader
export async function loader({
    request, params
}: LoaderFunctionArgs) {

    // Get the Id of the farm
    const b_id_farm = params.b_id_farm
    if (!b_id_farm) {
        throw new Response("Farm ID is required", { status: 400 });
    }

    // Get the cultivation
    const b_lu_catalogue = params.b_lu_catalogue
    console.log(b_lu_catalogue)
    // if (!b_id_farm) {
    //     throw new Response("Farm ID is required", { status: 400 });
    // }

    // Get the cultivation details for this cultivation
    const cultivationPlan = await getCultivationPlan(fdm, b_id_farm)
    const cultivation = cultivationPlan.find(cultivation => cultivation.b_lu_catalogue === b_lu_catalogue)

    // Fertilizer options
    const fertilizers = await getFertilizersFromCatalogue(fdm)
    const fertilizerOptions = fertilizers.map(fertilizer => {
        return {
            value: fertilizer.p_id_catalogue,
            label: fertilizer.p_name_nl
        }
    })

    return json({        
        b_lu_catalogue: b_lu_catalogue,
        b_id_farm: b_id_farm,
        cultivation: cultivation,
        fertilizerOptions: fertilizerOptions
    })

}

// Main
export default function Index() {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <Cultivation
            cultivation={loaderData.cultivation}
            fertilizerOptions={loaderData.fertilizerOptions}
        />
    );
}