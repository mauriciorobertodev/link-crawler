import { BrowserWindow, ipcMain } from 'electron';
import { ScrappingData, Link } from './../../shared/types/scrapping';
import { EventName } from './../../shared/events';
import { sleep } from './../../shared/helpers';
import { URL } from 'url';
import * as cheerio from 'cheerio';

let isRunning = false;
let data: ScrappingData = [];
let visitedUrls: Set<string> = new Set();

export async function initializeScrappingHandlers(win: BrowserWindow) {
    ipcMain.handle(EventName.SCRAPPING_START, async (_, website: string) => {
        isRunning = true;
        visitedUrls = new Set();
        data = [];

        win.webContents.send(EventName.SCRAPPING_START);

        await scrapeWebsite(website, win);

        isRunning = false;
        win.webContents.send(EventName.SCRAPPING_STOP);
    });

    ipcMain.handle(EventName.SCRAPPING_STOP, () => {
        isRunning = false;
        win.webContents.send(EventName.SCRAPPING_STOP);
    });
}

async function scrapeWebsite(url: string, win: BrowserWindow) {
    if (!isRunning || visitedUrls.has(url)) return;

    visitedUrls.add(url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').first().text().trim() ?? 'Sim título';
        const baseUrl = new URL(url);

        const links = $('a')
            .map((_, link) => $(link).attr('href')) // Pega os href dos links
            .get() // Converte o objeto cheerio para um array de strings
            .filter((href): href is string => href !== null) // Filtra valores null
            .map((href) => {
                // Converte URLs relativas para absolutas com base na URL da página atual
                try {
                    const linkUrl = new URL(href, baseUrl.href).toString();
                    return linkUrl;
                } catch (error) {
                    console.error(`Error processing link ${href}:`, error);
                    return null;
                }
            })
            .filter((link): link is string => link !== null) // Filtra valores null
            .filter((link) => isSameDomain(link, baseUrl.origin)); // Filtra links que são do mesmo domínio

        const pageData: Link = {
            title,
            url,
            status: response.status,
            completed: true,
            reason: null,
        };

        data.push(pageData);
        win.webContents.send(EventName.SCRAPPING_DATA, data);

        for (const link of links) {
            if (isRunning && !visitedUrls.has(link)) {
                await sleep(1);
                await scrapeWebsite(link, win);
            }
        }
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        const pageData: Link = {
            title: 'Error',
            url,
            status: 500,
            completed: false,
            reason: '',
        };
        data.push(pageData);
        win.webContents.send(EventName.SCRAPPING_DATA, data);
    }
}

function isSameDomain(link: string, baseDomain: string): boolean {
    try {
        const linkDomain = new URL(link).origin;
        return linkDomain === baseDomain;
    } catch {
        return false;
    }
}
