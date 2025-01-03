function ocrResponseDTO(data) {
    return ({
        id: data.id,
        status: data.content.status,
        results: data.content.results.output.results
    })
}

module.exports = ocrResponseDTO