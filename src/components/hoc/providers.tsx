import { Provider } from "react-redux";
import { store } from "../../store";

type ProvidersProps = {
  children: any;
};

function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
