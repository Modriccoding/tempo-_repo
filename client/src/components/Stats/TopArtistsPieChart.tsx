import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Artist {
  name: string;
  popularity: number; // La popularité n'est plus nécessaire pour le calcul du poids, mais on la garde si besoin
}

interface TopArtistsPieChartProps {
  timeRange: 'short_term' | 'medium_term' | 'long_term';
}

const TopArtistsPieChart: React.FC<TopArtistsPieChartProps> = ({ timeRange }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://tempo.local:3000/spotify/top-artists?time_range=${timeRange}&limit=10`,
          { credentials: 'include' }
        );
        const data = await response.json();
        const artists: Artist[] = data.items;

        if (artists && artists.length > 0) {
          const top5Artists = artists.slice(0, 5);
          const othersArtists = artists.slice(5);
          const totalArtists = artists.length;

          // Assigner un score basé sur le rang inversé (le n°1 a le plus de points)
          const getScore = (index: number) => totalArtists - index;
          
          const scores = top5Artists.map((artist, index) => getScore(index));
          const othersScore = othersArtists.reduce((sum, artist, index) => sum + getScore(top5Artists.length + index), 0);
          
          const totalScore = scores.reduce((sum, score) => sum + score, 0) + othersScore;

          const labels = top5Artists.map(a => a.name);
          const dataPoints = scores.map(score => (score / totalScore) * 100);

          if (othersArtists.length > 0) {
            labels.push('Autres');
            dataPoints.push((othersScore / totalScore) * 100);
          }
          
          setChartData({
            labels,
            datasets: [
              {
                label: '% d\'écoute (basé sur le classement)',
                data: dataPoints,
                backgroundColor: [
                  '#1DB954', // Spotify Green
                  '#1ED760',
                  '#28a745',
                  '#218838',
                  '#1e7e34',
                  '#535353', // Grey for "Autres"
                ],
                borderColor: '#121212',
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Erreur de chargement du graphique:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [timeRange]);

  if (loading) {
    return <div className="text-center p-4">Chargement du graphique...</div>;
  }

  if (!chartData) {
    return <div className="text-center p-4">Pas de données à afficher.</div>;
  }

  return (
    <div className="bg-spotify-dark p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Répartition de vos artistes favoris</h2>
      <div style={{ maxHeight: '400px', display: 'flex', justifyContent: 'center' }}>
        <Pie 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: '#FFFFFF',
                  font: {
                    size: 14,
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed !== null) {
                      label += context.parsed.toFixed(2) + '%';
                    }
                    return label;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default TopArtistsPieChart; 
