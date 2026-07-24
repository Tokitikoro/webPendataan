import { Survey } from "./types";
const m=(pairs: [number,number][]) => Array.from({length:12},(_,i)=>({target:pairs[i]?.[0]||0,realization:pairs[i]?.[1]||0}));
export const sampleSurveys: Survey[] = [
 {id:"s1",category:"STATISTIK IPDS",name:"Pembinaan Statistik Sektoral [PSS]",period:"Triwulan",owner:"Tim Produksi",months:m([[0,1],[0,0],[0,0],[6,5],[0,0],[0,0],[0,0],[0,0],[0,0],[1,0]])},
 {id:"s2",category:"STATISTIK IPDS",name:"Pemantauan dan Evaluasi Kinerja Penyelenggaraan Pelayanan Publik [PEKPPP]",period:"Tahun",owner:"Tim Produksi",months:m([[0,0],[0,0],[0,0],[0,0],[5,5]])},
 {id:"s3",category:"STATISTIK IPDS",name:"Berita Resmi Statistik [BRS]",period:"Triwulan",owner:"Tim Distribusi",months:m([[0,0],[0,0],[2,0],[0,0],[0,0],[0,0],[1,0],[0,0],[0,0],[0,3]])},
 {id:"s4",category:"STATISTIK IPDS",name:"Publikasi ARC",period:"Subround",owner:"Tim Pertanian",months:m([[4,2],[0,0],[0,0]])},
 {id:"s5",category:"STATISTIK IPDS",name:"Manajemen Web BPS",period:"Subround",owner:"Tim Pertanian",months:m([[3,0],[0,0],[0,3]])},
];
