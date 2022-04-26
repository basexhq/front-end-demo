// THINK: do we require MetaMask to access the website?
// For the time being yes, as it allows to read the data
// TODO: obviously do not require it

async function initializeETH() {

    let signer, provider;
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        signer = provider.getSigner()
    } catch {
        console.error("Initialising MetaMask failed");
        document.getElementById("metamask-required").style.display = "block";
        return;
    }

    // Check if there is correct network
    if (window.ethereum.networkVersion != networkId) {
        // TODO: https://stackoverflow.com/questions/68252365/how-to-trigger-change-blockchain-network-request-on-metamask
        document.getElementById("switch-network").style.display = "block";
        return
    }

    // We are properly initialised now
    document.getElementById("metamask-ok").style.display = "block";

    contract = new ethers.Contract(contractAddress , abi , signer)

    organisationsLength = (await contract.organisationsLength()).toNumber();

    let arrayOfPromises = [];
    for (let i=0; i<organisationsLength; i++) {
        arrayOfPromises.push(contract.organisations(i))
    }
    let tempResult = await Promise.all(arrayOfPromises);

    organisationNames = tempResult.map(item => ({ orgId: item.orgId, name: item.name }));

    // https://docs.angularjs.org/guide/bootstrap
    // Examples of when you'd need to do this include using script loaders or the need to perform an operation before AngularJS compiles a page.
    angular.element(function() {
        angular.bootstrap(document, ['app']);
    });

}

initializeETH();