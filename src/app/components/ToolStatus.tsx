// Les 12: kant-en-klare meldingen voor een tool die bezig is of een fout gaf

export function ToolBezig({tekst}: { tekst: string }) {
    return <p className="animate-pulse text-sm text-gray-500">{tekst}</p>;
}

export function ToolFout({tekst}: { tekst: string }) {
    return <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">{tekst}</p>;
}
