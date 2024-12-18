import { calculeHeure, getCircleColor } from '../screens/adminScreens/MonitoringScreen';


console.log('Début des tests...');
describe('calculeHeure', () => {
    test("calcule correctement la différence entre une heure passée et maintenant", () => {
        const heureArrivee = new Date(new Date() - (2 * 60 * 60 * 1000 + 30 * 60 * 1000)); // Il y a 2h30
        expect(calculeHeure(heureArrivee)).toBe('2h 30min');
    });

    test("retourne 0h 0min pour une heure identique", () => {
        const heureArrivee = new Date();
        expect(calculeHeure(heureArrivee)).toBe('0h 0min');
    });

    test("lève une erreur si l'heure est dans le futur", () => {
        const heureFutur = new Date(new Date().getTime() + 1000 * 60 * 60); // Dans 1h
        expect(() => calculeHeure(heureFutur)).toThrow("L'heure d'arrivée ne peut pas être dans le futur");
    });

    test("lève une erreur si l'argument n'est pas une date", () => {
        expect(() => calculeHeure('2024-06-17')).toThrow("L'heure d'arrivée doit être une instance Date.('heureArrivee')");
        expect(() => calculeHeure(12345)).toThrow("L'heure d'arrivée doit être une instance Date.('heureArrivee')");
        expect(() => calculeHeure(null)).toThrow("L'heure d'arrivée doit être une instance Date.('heureArrivee')");
    });
});

describe('getCircleColor', () => {
    test("retourne 'gray' si aucun parking n'est sélectionné (select = false)", () => {
        expect(getCircleColor(10, 20, false)).toBe("gray");
    });

    test("lève une erreur si select est null ou undefined", () => {
        expect(() => getCircleColor(10, 20, null)).toThrow("Le paramètre 'select' ne doit pas être null ou undefined.");
        expect(() => getCircleColor(10, 20, undefined)).toThrow("Le paramètre 'select' ne doit pas être null ou undefined.");
    });

    test("lève une erreur si nbrPMR est négatif", () => {
        expect(() => getCircleColor(-1, 20, true)).toThrow("Le paramètre 'nbrPMR' doit être un nombre positif.");
    });

    test("lève une erreur si nbrPlaces est zéro ou négatif", () => {
        expect(() => getCircleColor(10, 0, true)).toThrow("Le paramètre 'nbrPlaces' doit être un nombre positif et supérieur à zéro.");
        expect(() => getCircleColor(10, -5, true)).toThrow("Le paramètre 'nbrPlaces' doit être un nombre positif et supérieur à zéro.");
    });

    test("calcule correctement le taux d'occupation < 75%", () => {
        expect(getCircleColor(10, 20, true)).toBe("green");
    });

    test("calcule correctement le taux d'occupation entre 75% et 95%", () => {
        expect(getCircleColor(15, 20, true)).toBe("orange");
    });

    test("calcule correctement le taux d'occupation = 95%", () => {
        expect(getCircleColor(19, 20, true)).toBe("orange");
    });
    test("calcule correctement le taux d'occupation > 95%", () => {
        expect(getCircleColor(96, 100, true)).toBe("red");
    });
});


console.log('Fin des tests.');