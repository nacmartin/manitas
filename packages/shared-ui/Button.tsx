export function Button(props: any) {
  return <button onClick={() => props.onClick()}>oolo{props.children}</button>;
}
export default Button;
