import { Button } from "../button";

export const CTAs = () => {
    return (
        <div className="flex items-center gap-2">
            <Button type="main" colorVariant="secondary">
                Sign In
            </Button>
            <Button type="main" colorVariant="primary">
                Get Started
            </Button>
        </div>
    );
}