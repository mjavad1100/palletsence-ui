
// app/ui/dashboard/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Card from "@/app/ui/dashboard/card/card";
import PelletAnalysisViewer from "@/app/ui/dashboard/imageLoader/pelletAnalysisViewer";
import ActionCard from "@/app/ui/dashboard/card/actionCard";
import ComposedChartCard from '../ui/dashboard/ComposedChart/ComposedChart';
import StatsCards from "@/app/ui/dashboard/StatsCards/StatsCards"


const DashboardPage = () => {
  const exampleData = [
    { name: 'Jan', bar: 590, line: 800, area: 400 },
    { name: 'Feb', bar: 868, line: 967, area: 506 },
    { name: 'Mar', bar: 1397, line: 1098, area: 229 },
    { name: 'Apr', bar: 1480, line: 1200, area: 128 },
    { name: 'May', bar: 1520, line: 1108, area: 800 },
    { name: 'Jun', bar: 1400, line: 680, area: 700 },

  ];


  const cards = [
    {
      title: "Uptime",
      content: "112233",
      chartType: "area"
    },
    {
      title: "Capture Rate",
      content: "75",
      chartType: "line"
    },
    {
      title: "Feed Rate",
      content: "5000",
      chartType: "bar"
    },
  ];

  const [imageSrc, setImageSrc] = useState(null);
  const lastImage = "iVBORw0KGgoAAAANSUhEUgAAAfQAA...";

  useEffect(() => setImageSrc(lastImage), []);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <section className={styles.cardsContainer}>
        <h2 className="text-xl font-semibold mb-7 mt-4">Pellet Process KPIs</h2>
        <StatsCards />
        <h2 className="text-xl font-semibold mb-4 mt-10">Chart Process</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          {/* {cards.map(c => <Card key={c.title} item={c} />)} */}
          <div className="lg:col-span-2">
            <ComposedChartCard
              title="Production Overview"
              data={exampleData}
              barKey="bar"
              lineKey="line"
              areaKey="area"
            />

          </div>
          {/* <Card item={{
            title: "Production Output",
            value: 1250000,
            unit: "units",
            chartType: "production",
            status: "normal"
          }} /> */}
        </div>
      </section>

      {/* Latest Image */}
      <section className={styles.imageContainer}>
        <h2 className="text-xl font-semibold mb-4">Latest Pellet Image</h2>
        <div className={styles.lastImage}>
          {imageSrc && <PelletAnalysisViewer />}
        </div>
      </section>

      {/* Actions */}
      {/* <section className="px-2 sm:px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard name="Speed" />
          <ActionCard name="Feed" />
          <ActionCard name="Valve 2" />
        </div>
      </section> */}
    </div >
  );
};

export default DashboardPage;
