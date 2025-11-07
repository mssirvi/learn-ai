interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    return (
        <header className="sticky top-0 bg-transparent">
            <div className="max-w-4xl mx-auto py-4 px-4">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
        </header>
    );
};