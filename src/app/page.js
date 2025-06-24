"use client";
import React,{useEffect} from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import InfoCard from "@/components/InfoCard";
import Productlist from "@/components/productlist"; 
import Productlisttwo from "@/components/Productlisttwo";
import EcommerceFooter from "@/components/EcommerceFooter";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";


export default function Home() {
  const { user,token } = useUser();
   const router = useRouter();
  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  return (
   <>
   <Navbar />
   <Hero />
   <ProductCard/>
   <InfoCard />
  <Productlist />
  <Productlisttwo />
  <EcommerceFooter/>
   </>
  );
}
