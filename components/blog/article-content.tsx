import { BlogBlock } from '@/lib/data/blog';

export function ArticleContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="mt-10 mb-3 font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="mt-7 mb-2 text-lg font-semibold text-foreground">
                {block.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="mb-4 text-base leading-relaxed text-foreground/90">
                {block.text}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="mb-4 space-y-2 pl-5 list-disc text-foreground/90 leading-relaxed">
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1 marker:text-gold">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mb-4 space-y-2 pl-5 list-decimal text-foreground/90 leading-relaxed">
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1 marker:text-gold">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case 'callout':
            return (
              <div
                key={i}
                className="my-6 rounded-2xl border border-gold/25 bg-gold/5 p-5"
              >
                {block.title && (
                  <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-gold">
                    {block.title}
                  </div>
                )}
                <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>
              </div>
            );
          case 'table':
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-gold/10">
                      {block.headers.map((h, hi) => (
                        <th
                          key={hi}
                          scope="col"
                          className="px-4 py-3 font-semibold text-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-t border-border even:bg-background/40">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 align-top text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
