import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogic } from './use-logic';
import { Loader2Icon } from 'lucide-react';

export function MainScreen() {
    const {
        state: links,
        website,
        setWebsite,
        startScrapping,
        stopScrapping,
        scrapping,
    } = useLogic();

    return (
        <div className="h-full w-full p-4 space-y-4">
            <div className="flex items-center gap-4">
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                {scrapping && <Button onClick={() => stopScrapping()}>Stop</Button>}
                {!scrapping && <Button onClick={() => startScrapping()}>Start</Button>}
            </div>
            <div className="space-y-2">
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="border p-2 rounded-md flex items-center justify-between"
                    >
                        <a href={link.url} target="_blank">
                            {link.title}{' '}
                            <span className="text-xs text-muted-foreground">{link.url}</span>
                        </a>
                        <p>{link.status}</p>
                    </div>
                ))}
                {scrapping && (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
