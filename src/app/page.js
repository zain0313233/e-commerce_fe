"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import InfoCard from "@/components/InfoCard";
import Productlist from "@/components/productlist"; 
import Productlisttwo from "@/components/Productlisttwo";
import EcommerceFooter from "@/components/EcommerceFooter";
import Image from "next/image";


export default function Home() {
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
