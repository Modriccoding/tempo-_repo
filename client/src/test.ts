// async function testTopArtists() {
//   try {
//     const response = await fetch(
//       "https://localhost:3000/api/spotify/test-top-artists",
//       {
//         credentials: "include",
//         headers: {
//           Accept: "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Réponse du serveur:", data);
//   } catch (error) {
//     console.error("Erreur lors du test:", error);
//   }
// }

// // Exécuter le test
// testTopArtists();
