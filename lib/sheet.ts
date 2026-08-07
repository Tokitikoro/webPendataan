import Papa from "papaparse";
import { Survey } from "./types";
import { sampleSurveys } from "./sample-data";
const monthKeys=["jan","feb","mar","apr","mei","jun","jul","agu","sep","okt","nov","des"];
export async function getSurveys(): Promise<{data:Survey[];source:string}> {
 const url=process.env.GOOGLE_SHEET_CSV_URL;
 if(!url) return {data:sampleSurveys,source:"Data demo"};
 try{
  const res=await fetch(url,{next:{revalidate:300}});
  if(!res.ok) throw new Error("Spreadsheet tidak dapat dibaca");
  const text=await res.text();
  const parsed=Papa.parse<Record<string,string>>(text,{header:true,skipEmptyLines:true,transformHeader:h=>h.trim().toLowerCase()});
  const data=parsed.data.map((r,i):Survey=>({
   id:r.id||`sheet-${i}`, category:r.kategori||"LAINNYA", name:r.kegiatan||"Tanpa nama",
   period:r.periode||"-", owner:r.penanggung_jawab||"-",
   months:monthKeys.map(k=>({target:Number(r[`${k}_target`]||0),realization:Number(r[`${k}_realisasi`]||0)}))
  }));
  if(!data.length) throw new Error("Spreadsheet kosong");
  return {data,source:"Google Spreadsheet"};
 }catch(e){ console.error(e); return {data:sampleSurveys,source:"Data demo (spreadsheet gagal dimuat)"}; }
}
