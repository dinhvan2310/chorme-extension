interface RenderIfProps {
    condition: boolean;
    children: React.ReactNode;
}
function RenderIf(props: RenderIfProps) {
    return <>{props.condition ? props.children : null}</>;
}

export default RenderIf;
