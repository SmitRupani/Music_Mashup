let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let tracks = [];

        async function searchTracks() {
            const query = document.getElementById('query').value;
            const response = await fetch(`/search?query=${query}`);
            const results = await response.json();

            const trackContainer = document.getElementById('tracks');
            trackContainer.innerHTML = results.map((track, index) => `
                <div>
                    <span>${track.name}</span>
                    <button onclick="addTrack('${track.preview_url}', ${index})">Add to Mashup</button>
                </div>
            `).join('');
        }

        async function addTrack(url, index) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            tracks[index] = audioBuffer;
        }

        function playMashup() {
            const output = audioContext.createGain();
            output.connect(audioContext.destination);

            tracks.forEach((buffer, index) => {
                const trackSource = audioContext.createBufferSource();
                trackSource.buffer = buffer;
                trackSource.connect(output);
                trackSource.start(audioContext.currentTime + index * 0.5); // Layered start
            });
        }