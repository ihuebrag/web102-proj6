import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import md5 from 'md5';

// Register necessary components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const PUBLIC_KEY = '0f0c818eb8ec3a84d65ce78a2cbfd897'; // Replace with your Marvel API public key
const PRIVATE_KEY = 'fdacc7ba02bcba2f2f69bf81c841ad203ecf2f1b'; // Replace with your Marvel API private key
const BASE_URL = 'https://gateway.marvel.com/v1/public/';

const MyPieChartComponent = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }]
    });

    useEffect(() => {
        const fetchMarvelData = async () => {
            try {
                const timestamp = new Date().getTime();
                const hash = md5(timestamp + PRIVATE_KEY + PUBLIC_KEY);
                
                const response = await axios.get(
                    `${BASE_URL}characters?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}`
                );

                console.log(response.data); // Log the response for debugging

                if (response.data && response.data.data && Array.isArray(response.data.data.results)) {
                    const comicCharacterCounts = {};

                    // Count characters for each comic
                    response.data.data.results.forEach(character => {
                        character.series.items.forEach(series => {
                            if (comicCharacterCounts[series.name]) {
                                comicCharacterCounts[series.name]++;
                            } else {
                                comicCharacterCounts[series.name] = 1;
                            }
                        });
                    });

                    // Prepare data for the pie chart
                    const labels = Object.keys(comicCharacterCounts);
                    const data = Object.values(comicCharacterCounts);
                    const backgroundColor = labels.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`); // Generate random colors

                    // Set chart data
                    setChartData({
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: backgroundColor,
                        }],
                    });
                } else {
                    console.error('No results found in the response data.');
                }
            } catch (error) {
                console.error('Error fetching data from Marvel API:', error);
            }
        };

        fetchMarvelData();
    }, []);

    return (
        <div>
            <h2>Marvel Characters per Comic</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default MyPieChartComponent;
