import { IpcRendererEvent } from 'electron';
import { useEffect, useState } from 'react';

import { ScrappingData } from '../../../shared/types/scrapping';
import { EventName } from '../../../shared/events';

export function useLogic() {
    const [website, setWebsite] = useState('https://mauricioroberto.com');
    const [scrapping, setScrapping] = useState(false);
    const [state, setState] = useState<ScrappingData>([]);

    async function startScrapping() {
        window.scrapping.startScrapping(website);
        setState([]);
    }

    async function stopScrapping() {
        window.scrapping.stopScrapping();
    }

    useEffect(() => {
        const handler = (_: IpcRendererEvent, data: ScrappingData) => {
            setState(data);
        };

        const onStart = () => {
            setScrapping(true);
        };

        const onStop = () => {
            setScrapping(false);
        };

        window.ipcRenderer.on(EventName.SCRAPPING_DATA, handler);
        window.ipcRenderer.on(EventName.SCRAPPING_START, onStart);
        window.ipcRenderer.on(EventName.SCRAPPING_STOP, onStop);

        return () => {
            window.ipcRenderer.off(EventName.SCRAPPING_DATA, handler);
            window.ipcRenderer.off(EventName.SCRAPPING_START, onStart);
            window.ipcRenderer.off(EventName.SCRAPPING_STOP, onStop);
        };
    }, [website]);

    return { state, website, setWebsite, startScrapping, stopScrapping, scrapping };
}
