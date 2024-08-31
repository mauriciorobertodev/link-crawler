import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';

export function MainScreen() {
    const { toggleTheme } = useTheme();

    return (
        <div className="h-screen w-screen p-4">
            <div className="flex items-center gap-4">
                <Input />
                <Button onClick={() => toggleTheme()}>Varrer site</Button>
            </div>
            <p>{`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`}</p>
        </div>
    );
}
