import {MemoryRouter} from "react-router-dom";
import React from "react";

type Props = {
    children: React.ReactNode;
}
export const Router = (props: Props) => {
    const {children} = props;

    return (
        <MemoryRouter>
            {children}
        </MemoryRouter>
    );
};
