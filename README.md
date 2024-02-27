# **Project of Conserved Core GO_Tool Viewer**

## **Aims**

Aim of the project is to find a conserved core group of proteins in a given Gene Ontology (GO) term based on seven model organisms. We are using the GO_SLIM (generic) subset of the GO terms, then combing them with eggNOG 5.0 database to determinate the conserved core. The model organisms are: 
- A. thaliana, 
- C. elegans,
- D. melanogaster,
- D. rerio,
- H. sapiens, 
- S. cerevisiae and 
- S. pombe

The viewer currently shows the overlapping species in a 7-set Venn Diagram using jQuery, Bootstrap and DataTable.

Back-end source made in Febrary, 2022.

File structure

- data/ folder contains
  - **Gene ontology files** in an ordered way, calculated earlier in an other project.
  Named {GO_ID}-ordered-2022-01.tsv files.
  - **diagrams.json** - json list of Venn diagrams
  - **ortholog_venn** diagrams, named ortholog_venn_{set-number}.svg
- js/ folder conatins the main javascript files
  - **go_tool_scripts.js** - main javascript file.
  - archive/ folder for keeping some old stuff
- media/css/ to keep stylign files here
  - **go_tool_style.css** the main css stylesheet of the project
- testbox/ to make sandboxing some test stuff
- **index.php** - the main load load file.

Last updated on 27/02/2024.

    
