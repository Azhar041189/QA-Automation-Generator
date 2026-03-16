const vscode = require("vscode")

function activate(context) {

    let disposable = vscode.commands.registerCommand(
        "qa.generateTest",
        function () {

            vscode.window.showInformationMessage(
                "Generating automation test..."
            )

        })

    context.subscriptions.push(disposable)

}

exports.activate = activate