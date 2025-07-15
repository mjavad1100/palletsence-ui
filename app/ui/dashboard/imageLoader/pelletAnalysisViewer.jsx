'use client'
import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function PelletAnalysisViewer() {
    const [analysisData, setAnalysisData] = useState(null);
    const [imageBlobs, setImageBlobs] = useState({
        original: null,
        circled: null,
        masked: null
    });
    const [error, setError] = useState(null);
    const lastImageNameRef = useRef(null);
    const imageRefs = {
        original: useRef(null),
        circled: useRef(null),
        masked: useRef(null)
    };

    const fetchLatestAnalysis = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/image-analysis/pellet-analysis/latest/`);
            if (!response.ok) throw new Error('Failed to fetch analysis data');
            const newData = await response.json();

            if (newData && newData.image_name !== lastImageNameRef.current) {
                setAnalysisData(newData);
                lastImageNameRef.current = newData.image_name;

                // Fetch all three image variations
                const imageName = newData.image_name;
                const imageBaseName = imageName.substring(0, imageName.lastIndexOf('.'));

                const fetchImages = async () => {
                    const images = {
                        original: imageName,
                        circled: `${imageBaseName}_circled.jpg`,
                        masked: `${imageBaseName}_segmented_mask.png`
                    };

                    const newBlobs = {};
                    for (const [key, name] of Object.entries(images)) {
                        const imageResponse = await fetch(
                            `${API_BASE_URL}/api/image-analysis/pellet-analysis/get_image/?image_name=${name}`
                        );
                        if (!imageResponse.ok) throw new Error(`Failed to fetch ${key} image`);
                        newBlobs[key] = await imageResponse.blob();
                    }
                    setImageBlobs(newBlobs);
                };

                await fetchImages();
            }
        } catch (err) {
            setError(err.message);
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        // Create object URLs for all images
        Object.entries(imageBlobs).forEach(([key, blob]) => {
            if (blob && imageRefs[key].current) {
                const url = URL.createObjectURL(blob);
                imageRefs[key].current.src = url;
                return () => URL.revokeObjectURL(url);
            }
        });
    }, [imageBlobs]);

    useEffect(() => {
        fetchLatestAnalysis();
        const intervalId = setInterval(fetchLatestAnalysis, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-4 max-w-4xl mx-auto text-black">
            {error && (
                <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {analysisData ? (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-bold mb-2 text-black">Latest Analysis Results</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Created At:</p>
                                <p className="text-black">{new Date(analysisData.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Image Name:</p>
                                <p className="text-black">{analysisData.image_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Execution Time:</p>
                                <p className="text-black">{analysisData.execution_time}s</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Average:</p>
                                <p className="text-black">{analysisData.Average.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Standard Deviation:</p>
                                <p className="text-black">{analysisData.StandardDeviation.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Count:</p>
                                <p className="text-black">{analysisData.count}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-bold mb-2 text-black">Original Image</h3>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <img
                                    ref={imageRefs.original}
                                    alt="Original Pellet Analysis"
                                    className="object-contain w-full h-full"
                                    onError={() => setError('Failed to load original image')}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-bold mb-2 text-black">Circled Image</h3>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <img
                                    ref={imageRefs.circled}
                                    alt="Circled Pellet Analysis"
                                    className="object-contain w-full h-full"
                                    onError={() => setError('Failed to load circled image')}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-bold mb-2 text-black">Masked Image</h3>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <img
                                    ref={imageRefs.masked}
                                    alt="Masked Pellet Analysis"
                                    className="object-contain w-full h-full"
                                    onError={() => setError('Failed to load masked image')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-48">
                    <p className="text-black">Loading analysis data...</p>
                </div>
            )}
        </div>
    );
}