import { Form, useNavigation } from "@remix-run/react";

// Components
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { FieldMap } from "@/components/blocks/field-map";
import { ClientOnly } from "remix-utils/client-only";
import { Skeleton } from "../ui/skeleton";

export interface soilTypesListType {
    value: string
    label: string
}

export interface fieldType {
    /** Mapbox API token for map rendering */
    mapboxToken: string;
    /** Unique identifier for the field */
    b_id: string
    /** Display name of the field */
    b_name: string
    /** Area of the field in hectares */
    b_area: number | null
    /** Agricultural soil type classification */
    b_soiltype_agr: string | null
    b_geojson: GeoJSON.Feature | GeoJSON.FeatureCollection
    action: string
}

export interface fieldsType {
    fields: fieldType[]
    mapboxToken: string
    action: string
}

export function Fields(props: fieldsType) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
            {props.fields.map(field => {
                return (
                    <div key={field.b_id}>
                        <Field
                            b_id={field.b_id}
                            b_name={field.b_name}
                            b_area={10}
                            b_soiltype_agr={"klei"}
                            b_geojson={field.b_geojson}
                            action={props.action}
                            mapboxToken={props.mapboxToken}
                        />
                    </div>
                )
            })}
        </div>
    )
}

function Field(props: fieldType) {
    const navigation = useNavigation();
    const { toast } = useToast()

    function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        try {
            toast({
                title: "Perceel is bijgewerkt",
                description: "",
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error updating field",
                    description: error.message,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <div id={props.b_id} className="flex items-center justify-center">
            <Card className="w-full max-w-[350px]">
                <Form className="" action={props.action} method="post">
                    <CardHeader>
                        {/* <CardTitle>{props.b_name}</CardTitle>
                        <CardDescription>{props.b_area} ha</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid w-full items-center gap-2">
                                <div>
                                    <Input id="b_id" name="b_id" type="hidden" value={props.b_id} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="b_name">Perceelsnaam</Label>
                                    <Input id="b_name" name="b_name" placeholder="Bv. Achter de schuur" defaultValue={props.b_name} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="b_lu">Hoofdgewas</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="w-full h-[150px] items-center">
                                <ClientOnly
                                    fallback={
                                        <Skeleton className="h-full w-full rounded-xl" />
                                    }                        >
                                    {() => <FieldMap
                                        b_geojson={props.b_geojson}
                                        mapboxToken={props.mapboxToken}
                                    />
                                    }
                                </ClientOnly>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit" onClick={onSubmit}>
                            {navigation.state === "submitting"
                                ? "Opslaan..."
                                : "Bijwerken"}
                        </Button>
                    </CardFooter>
                </Form>
            </Card >
        </div>
    )
}
