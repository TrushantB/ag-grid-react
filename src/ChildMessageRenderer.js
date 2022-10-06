
import React from "react";
const ChildMessageRenderer = ({ context, node }) => {
    function invokeParentMethod() {
        context.componentParent.methodFromParent(
            node.rowIndex
        );
    }
    return (
        <span>
            <button
                style={{ height: 20, lineHeight: 0.5 }}
                onClick={invokeParentMethod}
                className="btn btn-info"
            >
                Invoke Parent
            </button>
        </span>
    );
}
export default ChildMessageRenderer