import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Styled = {
    CodeCompiler: styled.div`
        background-color: rgb(40,42,53);
        ${(props) => props.css}
    `,
};

function CodeCompiler({ codes }) {
    // Language strings
    const [hmtlS, cssS, jsS] = codes;

    useEffect(() => {
        // TODO: find another solution other then eval()
        window.eval(jsS);
    }, [jsS]);

    return (
        <Styled.CodeCompiler
            dangerouslySetInnerHTML={{ __html: hmtlS }}
            css={cssS}
        />
    );
}

CodeCompiler.defaultProps = {
    codes: ['', '', ''],
};

CodeCompiler.propTypes = {
    codes: PropTypes.array,
};

export default CodeCompiler;
