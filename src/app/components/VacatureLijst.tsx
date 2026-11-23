// Les 12: kant-en-klare weergave van de zoekresultaten van je zoektool.
// Laat je tool objecten met deze velden teruggeven, of pas het type en de opmaak aan op de velden van jouw API.
export type Zoekresultaat = {
    id: string;
    titel: string;
    bedrijf: string | null;
    plaats: string | null;
    salarisMin: number | null;
    salarisMax: number | null;
    url: string;
};

function formatSalaris(min: number | null, max: number | null) {
    const euro = (bedrag: number) => `€ ${Math.round(bedrag).toLocaleString('nl-NL')}`;
    if (min !== null && max !== null && min !== max) return `${euro(min)} - ${euro(max)}`;
    if (min !== null) return euro(min);
    if (max !== null) return euro(max);
    return 'Niet vermeld';
}

export default function VacatureLijst({vacatures}: { vacatures: Zoekresultaat[] }) {
    if (vacatures.length === 0) {
        return <p className="text-sm text-gray-500">Geen vacatures gevonden.</p>;
    }

    return (
        <div className="space-y-2">
            <ul className="space-y-2">
                {vacatures.map((vacature) => (
                    <li key={vacature.id} className="rounded-lg border border-gray-200 bg-white p-3">
                        <a
                            href={vacature.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-700 underline"
                        >
                            {vacature.titel}
                        </a>
                        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 text-sm">
                            <dt className="font-semibold">Bedrijf</dt>
                            <dd>{vacature.bedrijf ?? 'Onbekend'}</dd>
                            <dt className="font-semibold">Plaats</dt>
                            <dd>{vacature.plaats ?? 'Onbekend'}</dd>
                            <dt className="font-semibold">Salaris</dt>
                            <dd>{formatSalaris(vacature.salarisMin, vacature.salarisMax)}</dd>
                        </dl>
                    </li>
                ))}
            </ul>
            {/* Les 12: bronvermelding, een voorwaarde voor het gebruik van de Adzuna API. Gebruik je een andere API? Kijk dan wat die vraagt. */}
            <p className="text-xs text-gray-500">
                Vacatures via{' '}
                <a href="https://www.adzuna.nl" target="_blank" rel="noopener noreferrer" className="underline">
                    Adzuna
                </a>
            </p>
        </div>
    );
}
