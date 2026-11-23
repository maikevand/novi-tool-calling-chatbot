// Les 12: dit component bepaalt per tool en per state wat er in de chat verschijnt.
// De opmaak staat al klaar in ToolStatus.tsx, VacatureLijst.tsx en VacatureKaart.tsx. Jij koppelt ze aan de tool-parts.

// TODO: vervang dit tijdelijke type door het type van een part uit je eigen berichttype.
//       Leid dat af met InferUITools in src/lib/chat/types.ts, bijvoorbeeld: ChatMessage['parts'][number]
type ToolPart = { type: string; state?: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- part gebruik je zodra je de TODO's hieronder uitwerkt
export default function ToolWeergave({part}: { part: ToolPart }) {
    // TODO: maak een switch op part.type, met een case voor elke tool, zoals 'tool-zoekVacatures' en 'tool-analyseerVacature'
    // TODO: kijk per tool naar part.state en geef het juiste component terug:
    //   - 'input-streaming' of 'input-available': <ToolBezig tekst="Vacatures zoeken..." />
    //   - 'output-available': <VacatureLijst vacatures={part.output} /> of <VacatureKaart vacature={part.output} />
    //   - 'output-error': <ToolFout tekst="Het zoeken naar vacatures is mislukt." />
    return null;
}
