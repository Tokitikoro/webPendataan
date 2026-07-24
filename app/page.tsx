import Dashboard from "@/components/Dashboard";
import { getSurveys } from "@/lib/sheet";
export default async function Home(){const result=await getSurveys();return <Dashboard initial={result.data} source={result.source}/>}
