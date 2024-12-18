import { useState, useEffect } from "react";
import { AgCharts } from 'ag-charts-react';
import { useGetParkingDataMutation } from "../../slices/adminApiSlice";

const AdminDashboard = () => {
    const [DataParking, setDataParking] = useState([]);
    const [chartData, setChartData] = useState([]); // Données pour le graphique mensuel
    const [annualTotals, setAnnualTotals] = useState([]); // Total des visiteurs par année
    const [selectedYear, setSelectedYear] = useState(2022); // Année sélectionnée
    const [getParkingsData] = useGetParkingDataMutation();

    // Récupération des données via l'API
    useEffect(() => {
        const fetchData = async () => {
            const responseFromApiCall = await getParkingsData();
            const responses = responseFromApiCall.data.usersDataParking;
            setDataParking(responses);
        };

        fetchData();
    }, [getParkingsData]);

    // Fonction pour normaliser les mois (pour les graphiques mensuels)
    const normalizeMonth = (month) => {
        return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    };

    // Calculer le total des visiteurs par mois pour l'année sélectionnée
    const calculateMonthlyTotal = (year) => {
        if (DataParking.length === 0) return;

        const parsedData = DataParking.map(entry => {
            const date = new Date(entry.date);
            if (isNaN(date.getTime())) return null;
            return {
                year: date.getFullYear(),
                month: date.toLocaleString('fr-FR', { month: 'long' }),
            };
        }).filter(entry => entry !== null);

        const filteredData = parsedData.filter(entry => entry.year === year);

        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        const monthlyTotals = months.map(month => {
            const normalizedMonth = normalizeMonth(month);
            const monthData = filteredData.filter(entry => normalizeMonth(entry.month) === normalizedMonth);
            return { month: month, visitors: monthData.length };
        });

        setChartData(monthlyTotals);
    };

    // Calculer le total des visiteurs pour les années 2022 à 2024
    const calculateAnnualTotals = () => {
        if (DataParking.length === 0) return;

        const parsedData = DataParking.map(entry => {
            const date = new Date(entry.date);
            if (isNaN(date.getTime())) return null;
            return {
                year: date.getFullYear(),
            };
        }).filter(entry => entry !== null);

        // Total des visiteurs pour chaque année
        const years = [2022, 2023, 2024];
        const totals = years.map(year => {
            const yearData = parsedData.filter(entry => entry.year === year);
            return { year: year, visitors: yearData.length };
        });

        setAnnualTotals(totals);
    };

    useEffect(() => {
        if (DataParking.length > 0) {
            calculateMonthlyTotal(selectedYear);
            calculateAnnualTotals();
        }
    }, [DataParking, selectedYear]);

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setSelectedYear(newYear);
        calculateMonthlyTotal(newYear);
    };

    // Options pour le graphique mensuel
    const chartOptionsMonthly = {
        title: {
            text: `Nombre de visiteurs par mois - Année ${selectedYear}`,
        },
        data: chartData,
        series: [
            {
                type: 'bar',
                xKey: 'month',
                yKey: 'visitors',
                yName: 'Visiteurs',
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Mois' },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Nombre de visiteurs' },
            },
        ],
    };

    // Options pour le graphique annuel
    const chartOptionsAnnual = {
        title: {
            text: 'Total des visiteurs par année (2022-2024)',
        },
        data: annualTotals,
        series: [
            {
                type: 'bar',
                xKey: 'year',
                yKey: 'visitors',
                yName: 'Visiteurs',
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                title: { text: 'Année' },
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Nombre de visiteurs' },
            },
        ],
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
                Suivi des visiteurs
            </h1>

            {/* Sélecteur d'année */}
            <select
                value={selectedYear}
                onChange={handleYearChange}
                style={{ fontSize: '1.2rem', padding: '10px', marginBottom: '20px' }}
            >
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
            </select>

            {/* Graphique mensuel */}
            <AgCharts options={chartOptionsMonthly} style={{ marginBottom: '40px' }} />

            {/* Graphique annuel */}
            <AgCharts options={chartOptionsAnnual} />
        </div>
    );
};

export default AdminDashboard;
