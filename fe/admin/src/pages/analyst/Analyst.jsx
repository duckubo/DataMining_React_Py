import Chart from '../../components/chart/Chart';
import { useEffect, useMemo, useState } from 'react';
import './analyst.css'
import RadarChartPlot from '../../components/chart/RadarChartPlot';
import ScatterPlot from '../../components/chart/ClusterChart';
import SpiderChart from '../../components/chart/SpiderChart';
export default function Analyst() {

    return (
        <div className='analyst'>
            <ScatterPlot />
            <SpiderChart />
            <RadarChartPlot />
        </div>
    );
}
