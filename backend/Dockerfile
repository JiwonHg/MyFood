# base image
FROM continuumio/miniconda3

# set working directory
WORKDIR /workspace

# copy environment file
COPY environment.yml .

# create conda environment
RUN conda env create -f environment.yml

# ensure the environment is activated
RUN echo "source /opt/conda/etc/profile.d/conda.sh && conda activate myfood" > ~/.bashrc
ENV PATH /opt/conda/envs/myfood/bin:$PATH

# add app
COPY . .

# run the command using bash to ensure conda environment is activated
CMD ["bash", "-c", "source /opt/conda/etc/profile.d/conda.sh && conda activate myfood && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:5050"]
